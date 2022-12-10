#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

int GetNumber(){
    int t;
    std::cin>>t;
    return t;
}

int main() {
    vector<int> numbers;
    vector<int>::iterator low;
    int n=GetNumber(),value;
    for(int i=0;i<n;i++){
        numbers.push_back(GetNumber());
    }
    n=GetNumber();
    for(int i=0;i<n;i++){
        value=GetNumber();
        low=std::lower_bound (numbers.begin(), numbers.end(), value); 
        if(*low==value){
            std::cout<<"Yes "<<low-numbers.begin()+1<<endl;
        }
        else{
            std::cout<<"No "<<low-numbers.begin()+1<<endl;
        }
    }
    return 0;
}
