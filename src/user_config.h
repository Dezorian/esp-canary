#ifndef user_config_h
#define user_config_h

// Connect to existing WiFi (true) or Create Access Point (false)
#define WIFI_CLIENT false

#ifndef WIFI_SERVER_AP_NAME
  #define WIFI_SERVER_AP_NAME "WFT2"
#endif

#ifndef WIFI_SERVER_AP_PASSWORD
  #define WIFI_SERVER_AP_PASSWORD "1234567890"
#endif

#define SERVER_HOST_NAME "esp_server"

#define TOMCAT_ENABLED false
#define TOMCAT_PORT 80

#define OPENWRT_ENABLED true
#define OPENWRT_PORT 81

#define HOST_NAME "ds214"

#define MAC "00:11:32:85:ac:29"

#define NTP_TIME_OFFSET 7200

//Remember to change port in platformio.ini as well
#define OTA_PORT 56056
// #define OTA_PASS "H0We8Adu0SYGFUNTt25C7yuJ"


//============ REPORTING SECTION ================ //
#define MQTT_ENABLED false
#define MQTT_HOST "192.168.1.1"
#define MQTT_TOPIC "/security/honeypot"
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "Honeypot"
#define MQTT_USER "Honeypot"
#define MQTT_PASSWORD "NDCU74EJoh2N69GRhMfc"

#endif