## not done
https://github.com/zeit/pkg/issues/145#issuecomment-311150484
There is a way to cross-compile to ARM cpu in pkg@4.1.1. Instructions:
Open examples/express. Open package.json
Pay attention to license field and it's value. It must be set to open source to make pkg include the source code of all files of the package into executable.
Compile the project with pkg package.json -t node8-linux-armv6 --no-bytecode
The resulting executable will work on Raspberry Pi.
If there are any compile-time or run-time errors with your project, post them here.

# compile on raspi 3 [done pkg@4.3.0]
pkg -t node8-linux-armv7 index.js

## try
zeit pkg for rasberry