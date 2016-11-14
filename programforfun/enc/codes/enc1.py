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
    s += " .,!?()-';"
    return s
# Normal Ceasar 
def enc1(plaintxt, key):
    s = ''
    alphabet=CreateAlphabet()
    for c in plaintxt:
        if c in alphabet:
            s += alphabet[(alphabet.find(c) + key)%len(alphabet)]
        else:
            print c
    return s

# Ignore space Ceasar
def enc0(plaintxt, key):
    s = ''
    alphabet=CreateAlphabet('lower')
    for c in plaintxt:
        if c in alphabet:
            s += alphabet[(alphabet.find(c) + key)%len(alphabet)]
        elif c == '\n':
            s += c
        else:
            print "Unknown char ", c
    return s

# V 
def enc2(plaintxt, key):
    s = ''
    alphabet=CreateAlphabet()
    idx = 0
    for c in plaintxt:
        if c in alphabet:
            s += alphabet[(alphabet.find(c) + alphabet.find(key[idx]))%len(alphabet)]
        elif c == '\n':
            s += c
        else:
            print "Unknown char ", c
        idx = (idx+1)%len(key)
    return s
if __name__ == '__main__':
    f1 = open('3_ori.txt', 'r')
    #print enc0('initial broadcast test for lurker', 17)
    print enc2(f1.read(), 'EzraC')
    #print CreateAlphabet()

