#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
#include <cassert>
using namespace std;

class Student{
    private:
        int scores[5];
    public:
        Student(){};
        void input(){
            for(int i=0;i<5;i++){
                int n;
                std::cin>>n;
                scores[i]=n;
            }
        }
        int calculateTotalScore(){
            int sum=0;
            for(int i=0;i<5;i++){
                sum+=scores[i];
            }
            return sum;
        } 
};
