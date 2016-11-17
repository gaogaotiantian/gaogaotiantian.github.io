import random
def CreateAlphabet(flag = None):
    s = ''
    if flag == 'lower':
        for i in range(97, 123):
            s += chr(i)
        return s
    for i in range(48, 58):
        s += chr(i)
    for i in range(97, 123):
        s += chr(i)
    for i in range(65, 91):
        s += chr(i)
    s += " .,!?()-':;"
    return s
def CreateRandomAlphabet():
    alpha = CreateAlphabet()
    s = ''
    while len(s) < len(alpha):
        t = random.choice(alpha)
        if t not in s:
            s += t
    return s
# Normal Ceasar 
def enc1(plaintxt, key):
    s = ''
    alphabet=CreateAlphabet()
    for c in plaintxt:
        if c in alphabet:
            s += alphabet[(alphabet.find(c) + key)%len(alphabet)]
        else:
            print 'Normal Ceasar, Unknown char ', c
    return s

# Ignore space Ceasar
def enc0(plaintxt, key):
    s = ''
    alphabet=CreateAlphabet('lower')
    for c in plaintxt:
        if c in alphabet:
            s += alphabet[(alphabet.find(c) + key)%len(alphabet)]
        elif c == '\n' or c == ' ':
            s += c
        else:
            print "Unknown char ", c
    return s

# V 
def enc2(plaintxt, key, alphabet = None):
    s = ''
    if alphabet == None:
        alphabet=CreateAlphabet()
    idx = 0
    pos = 0
    for c in plaintxt:
        if c in alphabet:
            s += alphabet[(alphabet.find(c) + alphabet.find(key[idx]))%len(alphabet)]
            idx = (idx+1)%len(key)
        elif c == '\n':
            s += c
        else:
            print "Unknown char at pos ", pos, ": ", c
        pos += 1
    return s

def encPoem(plaintxt, key = None):
    alphabet = ' abcdefghijklmnopqrstuvwxyz'
    plaintxt = plaintxt.lower()
    s = ''
    for c in plaintxt:
        if c in alphabet:
            s += str(alphabet.find(c))
        elif c == '\n':
            s += c
        else:
            print 'Unknown char ', c
    if key == None:
        return s
    else:
        r = ''
        k = ''
        idx = 0
        for c in key:
            if c in alphabet:
                print c
                k += str(alphabet.find(c))
        print k
        for c in s:
            if '0' <= c <= '9':
                r += str(int(c) + int(k[idx])%10)
                idx = (idx+1)%10
            else:
                r += c
        return r
        
if __name__ == '__main__':
    print CreateRandomAlphabet()
    f1w = open('1.txt', 'w')
    f1w.write(enc0('initial broadcast test for lurker\n', 17))

    f2r = open('2_ori.txt', 'r')
    f2w = open('2.txt', 'w')
    f2w.write(enc1(f2r.read(), 24))

    f3r = open('3_ori.txt', 'r')
    f3w = open('3.txt', 'w')
    f3w.write(enc2(f3r.read(), 'EzraC'))

    f4r = open('4_ori.txt', 'r')
    f4w = open('4.txt', 'w')
    rdKey = 'sB-;InLuj2;,p3DP,9j3qlUoW65E4D!vuvlUB1ErG)TK'
    f4w.write(enc2(f4r.read(), rdKey))

    f5r = open('5_ori.txt', 'r')
    f5w = open('5.txt', 'w')
    alpha = "(:tK0P6DBpjoV7QRcCTr!x'mi-JHhqGZ,4)vEM5bWyOe9kS1IdnN ?fzALwl.s2X3U;uaFYg8"
    f5w.write(enc2(f5r.read(), 'a', alpha))

    f6r = open('6_ori.txt', 'r')
    f6w = open('6.txt', 'w')
    f6w.write(enc2(f6r.read(), 'b', alpha))

    f7r = open('7_ori.txt', 'r')
    f7w = open('7.txt', 'w')
    f7w.write(enc2(f7r.read(), 'c', alpha))

    f9r = open('9_ori.txt', 'r')
    f9w = open('9.txt', 'w')
    f9w.write(encPoem(f9r.read()))

    f10r = open('10_ori.txt', 'r')
    f10w = open('10.txt', 'w')
    f10w.write(encPoem(f10r.read(), 'ich liebe dich'))
