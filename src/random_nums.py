#generate 600 pairs of random numbers both under 100 in this format 1-77,3-44,5-67
import random
def generate_random_nums():
    random_nums = []
    for i in range(600):
        random_nums.append(str(random.randint(1,100)) + "-" + str(random.randint(1,100)))
        print(random_nums[i], end=",")
generate_random_nums()