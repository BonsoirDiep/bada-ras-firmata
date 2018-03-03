### EXECUTE ##
bash: chmod u+x index

### IF ERROR ##
Error: /usr/lib/arm-linux-gnueabihf/libstdc++.so.6: version `GLIBCXX_3.4.21' not found (required by /home/pi/Desktop/app/serialport.node)
Check your rasberry:
bash: strings /usr/lib/arm-linux-gnueabihf/libstdc++.so.6 | grep GLIBCXX

### FIX ##
Replace "serialport.node" with "serialport.node.other/serialport.node"
Read "serialport.txt" -> about OS

### FIX AGAIN ##
bash: curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
bash: sudo apt-get install -y nodejs
bash: cd <any_folder>
bash: npm init -y
bash: npm install serialport --save
go to <any_folder>/node_modules/serialport/build/Release
copy "serialport.node" to folder app (where file "config.json, index" is located)