#include "Arduino.h"
#include "../user_config.h"

boolean messagesAvailable = false;

String notifyMessage = "";
String attackerIpAddress = "";

#if MQTT_ENABLED
#include "mqtt.h"
MqttNotifier mqttNotifier;
#endif

#if EMAIL_ENABLED
#include "email.h"
EmailNotifier emailNotifier;
#endif

#include "consolelog.h"
ConsoleLogger consoleLog;

void initReporting()
{
#if MQTT_ENABLED
    mqttNotifier.Init();
#endif

#if EMAIL_ENABLED
    emailNotifier.Init();
#endif
}

void notify(String message)
{
    messagesAvailable = true;
    notifyMessage = message;
}

void notifyAttackOccurred(String attackerIp)
{
    messagesAvailable = true;
    attackerIpAddress = attackerIp;
}

void sendNotify(String message)
{
    consoleLog.Notify(message);

#if MQTT_ENABLED
    mqttNotifier.Notify(message);
#endif
#if EMAIL_ENABLED
    emailNotifier.Notify(message);
#endif
}
void sendNotifyAttackOccurred(String attackerIpAddress)
{
    consoleLog.NotifyAttackOccurred(attackerIpAddress);

#if MQTT_ENABLED
    mqttNotifier.NotifyAttackOccurred(attackerIpAddress);
#endif
#if EMAIL_ENABLED
    emailNotifier.NotifyAttackOccurred(attackerIpAddress);
#endif
}
void resetAttackState()
{
    consoleLog.ResetAttackState();
#if MQTT_ENABLED
    mqttNotifier.ResetAttackState();
#endif
#if EMAIL_ENABLED
    emailNotifier.ResetAttackState();
#endif
}

void notifyLoop()
{
    if (!messagesAvailable)
    {
        return;
    }

    if (notifyMessage.length() > 0)
    {
        sendNotify(notifyMessage);
        notifyMessage = "";
        messagesAvailable = false;
    }

    if (attackerIpAddress.length() > 0)
    {
        sendNotifyAttackOccurred(attackerIpAddress);
        attackerIpAddress = "";
        messagesAvailable = false;
    }
}