const r2pipe = require('r2pipe');
const r2 = r2pipe.lpipeSync();
const exec = require('child_process').execSync;
const highlight = require('cli-highlight').highlight;
const fs = require('fs');
const blessed = require('blessed');
const ArgumentParser = require('argparse').ArgumentParser;
const parser = new ArgumentParser({
      addHelp: true,
      description: 'r2retdec help'
});


// r2pipe.options = ['-N'];

function arg_help() {
      // argument parser
      parser.addArgument('-t', {
            help: 'Set temp file for decompiled code',
            defaultValue: '/tmp/r2.c',
            dest: 'tmp'
      });
      parser.addArgument('-p', {
            help: 'Print dicompilation to stdout',
            dest: 'print',
            action: 'storeTrue'
      });
      return parser.parseArgs();
}

function checkConfig() {
      // Checks for and returns the path of the config file
      var configFile = process.env.HOME + '/.r2retdec';
      if (!fs.existsSync(configFile)) {
            console.log('\nCould not find config file. Set the path to retdec in $HOME/.r2retdec');
            process.exit(0);
      } else {
            return fs.readFileSync(configFile, 'utf8');
      }
}

function boxFrame(align, height, width, content) {
      var frame = blessed.box({
            scrollable: true,
            alwaysScroll: true,
            scrollbar: {
                  bg: 'red'
            },
            vi: true,
            keys: true,
            mouse: true,
            top: align,
            left: 'center',
            width: width,
            height: height,
            content: content,
            tags: true,
            border: {
                  type: 'line'
            },
            style: {
                  fg: 'white',
                  border: {
                        fg: '#f0f0f0'
                  },
                  focus: {
                        border: {
                              bg: 'red'
                        }
                  }
            }
      });
      return frame;
}

function smallBoxes(command, key) {
      var info = screen.key([key], function () {
            var strings = boxFrame('left', '40%', '50%', command);
            strings.align = 'left';
            screen.append(strings);
            screen.key(['q'], function () {
                  strings.hide();
            });
            screen.render();
            strings.focus();
      });
}

// runs retdec decompiler script
var binaryPath = r2.cmdj('oj')[0].uri;
var pdf = r2.cmdj('pdfj');
var functionStartAddress = '0x' + pdf.addr.toString(16);
var functionEndAddress = '0x' + pdf.ops.pop().offset.toString(16);
var retDecPath = checkConfig().replace('\n', '');
var a = arg_help();
var command = `${retDecPath} --cleanup -o ${a.tmp} --select-ranges ${functionStartAddress}-${functionEndAddress} ${binaryPath}`;
var function_pdf = r2.cmd('pdf');

try {
      var p = exec(command).toString();
      var code = fs.readFileSync(a.tmp, 'utf8');
      var highlighted_code = highlight(code);

} catch (e) {
      highlighted_code = 'Not valid for 64 bit arch. Using pdc instead\n\n';
      highlighted_code += highlight(r2.cmd('pdc'));
}

if (a.print === true) {
      console.log(highlighted_code);
      process.exit(0);
}

var screen = blessed.screen({
      smartCSR: true
});

screen.title = 'r2retdec';

var help = blessed.text({
      parent: screen,
      content: 'HELP: q (quit), h (help)',
      width: '90%',
      left: 'center',
      top: '98%'
});

screen.key(['tab'], function (ch, key) {
      screen.focusNext();
});

screen.key(['h'], function (ch, key) {
      var help = blessed.box({
            top: 'center',
            left: 'center',
            width: '25%',
            height: '40%',
            content: `HELP:
c: close help
d: show disassembly
s: function strings
c: function calls
q: quit r2retdec
TAB: choose box`,
            border: {
                  type: 'line',
                  fg: 'red'
            },
            parent: screen
      });
      screen.append(help);
      help.focus();
      screen.key(['q'], function (key, ch) {
            help.destroy();
      });
});
// show disassembly
screen.key(['d'], function () {
      var box1 = boxFrame('left', '100%', '75%', function_pdf);
      box1.align = 'left';
      screen.append(box1);
      box1.key(['q'], function () {
            box1.hide();
      });
      screen.render();
      box1.focus();
});
// show strings
smallBoxes(r2.cmd('pdsf~str'), 's');

// show calls
var calls = smallBoxes;
calls.height = '50%';
calls(r2.cmd('pdsf~call'), 'c');

// show xref
smallBoxes(r2.cmd('axt'), 'x');

var box2 = boxFrame('center', '99%', '100%', highlighted_code);
box2.focus();
screen.append(box2);
box2.key(['q'], function () {
      screen.destroy();
      r2.quit();
      process.exit(0);
});

screen.render();
