@echo on
call npm run build
call adb -e push dist/com.firemoon.wallet.debug.1.0.0.rpk /data/quickapp/app/
call adb -e shell "mkdir /data/quickapp/app/com.firemoon.wallet"
call adb -e shell "unzip -o /data/quickapp/app/com.firemoon.wallet.debug.1.0.0.rpk -d /data/quickapp/app/com.firemoon.wallet"
call adb -e shell "reboot"
call timeout 2
call adb -e shell "vapp com.firemoon.wallet &"