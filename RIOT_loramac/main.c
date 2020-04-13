#include <string.h>
#include <inttypes.h>
#include <time.h>

#include "msg.h"
#include "shell.h"
#include "fmt.h"

#include "net/loramac.h"
#include "semtech_loramac.h"
#include "xtimer.h"

#define	MIN_TEMP	-50
#define MAX_TEMP	 50
#define MIN_HUM		  0
#define	MAX_HUM		100
#define MIN_WINDDIR   0
#define MAX_WINDDIR 360
#define MIN_WINDINT   0
#define MAX_WINDINT 100
#define MIN_RAIN	  0
#define MAX_RAIN	 50

#define START	"[\""
#define MIDDLE	"\",\""
#define END		"\"]"

#define SENSORS ((char const*[]){"t", "h", "wd", "wi", "r"})

semtech_loramac_t loramac;	// loramac stack

int set_deveui, set_appeui, set_appkey;


int cmd_set(int argc, char** argv)
{
	
	if(argc != 3) {
		printf("usage: %s <deveui|appeui|appkey> <parameter>\n", argv[0]);
		return 1;
	}

	if(strcmp(argv[1], "deveui") == 0) {
		/* set DEVEUI */
		uint8_t deveui[LORAMAC_DEVEUI_LEN];
		fmt_hex_bytes(deveui, argv[2]);
		semtech_loramac_set_deveui(&loramac, deveui);
		set_deveui = 1;
	}

	else if(strcmp(argv[1], "appeui") == 0) {
		/* set APPEUI */
		uint8_t appeui[LORAMAC_APPEUI_LEN];
		fmt_hex_bytes(appeui, argv[2]);
		semtech_loramac_set_appeui(&loramac, appeui);
		set_appeui = 1;
	}

	else if(strcmp(argv[1], "appkey") == 0) {
		/* set APPKEY */
		uint8_t appkey[LORAMAC_APPKEY_LEN];
		fmt_hex_bytes(appkey, argv[2]);
		semtech_loramac_set_appkey(&loramac, appkey);
		set_appkey = 1;
	}
	
	else {
		printf("usage: %s <deveui|appeui|appkey> <parameter>\n", argv[0]);
		return 1;
	}

	return 0;
}

int loramac_send(char* msg)
{
	uint8_t cnf = LORAMAC_DEFAULT_TX_MODE;  /* Default: confirmable */
	uint8_t port = LORAMAC_DEFAULT_TX_PORT; /* Default: 2 */

	semtech_loramac_set_tx_mode(&loramac, cnf);
	semtech_loramac_set_tx_port(&loramac, port);

	switch (semtech_loramac_send(&loramac, (uint8_t *)msg, strlen(msg))) {
		case SEMTECH_LORAMAC_NOT_JOINED:
			puts("Cannot send: not joined");
			return 1;

		case SEMTECH_LORAMAC_DUTYCYCLE_RESTRICTED:
			puts("Cannot send: dutycycle restriction");
			return 1;

		case SEMTECH_LORAMAC_BUSY:
			puts("Cannot send: MAC is busy");
			return 1;

		case SEMTECH_LORAMAC_TX_ERROR:
			puts("Cannot send: error");
			return 1;
	}

	/* wait for receive windows */
	switch (semtech_loramac_recv(&loramac)) {
		case SEMTECH_LORAMAC_DATA_RECEIVED:
			loramac.rx_data.payload[loramac.rx_data.payload_len] = 0;
			printf("Data received: %s, port: %d\n",
				   (char *)loramac.rx_data.payload, loramac.rx_data.port);
			break;

		case SEMTECH_LORAMAC_DUTYCYCLE_RESTRICTED:
			puts("Cannot send: dutycycle restriction");
			return 1;

		case SEMTECH_LORAMAC_BUSY:
			puts("Cannot send: MAC is busy");
			return 1;

		case SEMTECH_LORAMAC_TX_ERROR:
			puts("Cannot send: error");
			return 1;

		case SEMTECH_LORAMAC_TX_DONE:
			puts("TX complete, no data received");
			break;
	}

	if(loramac.link_chk.available)
		printf("Link check information:\n"
			   "  - Demodulation margin: %d\n"
			   "  - Number of gateways: %d\n",
			   loramac.link_chk.demod_margin,
			   loramac.link_chk.nb_gateways);

	return 0;
}

void doall(const char* sensor, int value)
{
	int len = snprintf(NULL, 0, "%d", value);
	char* v = (char*)malloc(len+1);
	snprintf(v, len+1, "%d", value);

	/* form message */
	char* msg = (char*)malloc(strlen(START)+strlen(sensor)+strlen(MIDDLE)+strlen(v)+strlen(END));
	strcpy(msg, START);
	strcat(msg, sensor);
	strcat(msg, MIDDLE);
	strcat(msg, v);
	strcat(msg, END);

	/* send message */
	if(loramac_send(msg))
		printf("Failed sending msg.\n");

	free(v);
	free(msg);
}

int cmd_start(int argc, char** argv)
{
	if(argc != 1) {
		printf("usage: %s \n", argv[0]);
		return 1;
	}

	if(!set_deveui || !set_appeui || !set_appkey) {
		printf("Missing configuration parameters (deveui, appeui, appkey).\n");
		return 1;
	}

	/* set data rate */
	semtech_loramac_set_dr(&loramac, LORAMAC_DR_5);
	/* join Over-The-Air-Activation */
    if (semtech_loramac_join(&loramac, LORAMAC_JOIN_OTAA) != SEMTECH_LORAMAC_JOIN_SUCCEEDED)
        return 1;
	printf("Parameters correctly configurated.\n");

	while(1) {
		srand(time(0));
		int rilevs[5] = {
			MIN_TEMP + (rand() % (MAX_TEMP-MIN_TEMP+1)),
			MIN_HUM + (rand() % (MAX_HUM-MIN_HUM+1)),
			MIN_WINDDIR + (rand() % (MAX_WINDDIR-MIN_WINDDIR+1)),
			MIN_WINDINT + (rand() % (MAX_WINDINT-MIN_WINDINT+1)),
			MIN_RAIN + (rand() % (MAX_RAIN-MIN_RAIN+1))
		};
		for(int i=0; i<5; i++) {
			doall(SENSORS[i], rilevs[i]);
			xtimer_sleep(10);
		}
	}
	return 0;
}

static const shell_command_t shell_commands[] = {
    { "start", "start env. station", cmd_start },
    { "set", "set config. parameters", cmd_set },
    { NULL, NULL, NULL }
};

int main(void)
{
    semtech_loramac_init(&loramac);

    puts("All up, running the shell now");
    char line_buf[SHELL_DEFAULT_BUFSIZE];
    shell_run(shell_commands, line_buf, SHELL_DEFAULT_BUFSIZE);
}
