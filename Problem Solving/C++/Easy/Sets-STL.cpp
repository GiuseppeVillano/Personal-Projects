#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <set>
#include <algorithm>
using namespace std;

int GetNumber(){
    int t;
    std::cin>>t;
    return t;
}

int main() {
    set<int> q;
    set<int>::iterator j;
    int size=GetNumber(),y;
    for(int i=0;i<size;i++){
        y=GetNumber();
        if(y==1){
            q.insert(GetNumber());
        }
        else if(y==2){
            q.erase(GetNumber());
        }
        else if(y==3){
            j=q.find(GetNumber());
            if(j!=q.end()){
                std::cout<<"Yes"<<endl;
            }
            else{
                std::cout<<"No"<<endl;
            }
        }
    }
    return 0;
}



