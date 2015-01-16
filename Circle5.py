from random import randrange

__author__ = 'bwoodley'

def main():
    questions = {
        'C': '',
        'G': 'F',
        'D': 'FC',
        'A': 'FCG',
        'E': 'FCGD',
        'B': 'FCGDA',
        'F#': 'FCGDAE',
        'C#': 'FCGDAEB',
        }
    question_list = list(questions.keys())


    while True:
        index = randrange(0, len(questions))

        answer = raw_input(question_list[index] + '>>> ')
        answer = answer.replace('S','#')
        right = answer == questions[question_list[index]]
        if right:
            print 'yeah!'
        else:
            print ':(   right answer is: ' + questions[question_list[index]]

if __name__ == '__main__':
    main()
