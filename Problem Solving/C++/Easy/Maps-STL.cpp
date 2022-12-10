#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <set>
#include <map>
#include <algorithm>
using namespace std;

int GetNumber(){
    int t;
    std::cin>>t;
    return t;
}

int main() {
    map<string,int>m;
    int q=GetNumber(),n;
    string key;
    for(int i=0;i<q;i++){
        n=GetNumber();
        if(n==1){
            std::cin>>key;
            if(m.find(key)==m.end()){
                m.insert(make_pair(key,GetNumber()));
            }
            else{
                m[key]+=GetNumber();
            }
        }
        else if(n==2){
            std::cin>>key;
            m.erase(key);
        }
        else if(n==3){
            std::cin>>key;
            if(m.find(key)!=m.end()){
                std::cout<<m[key]<<endl;
            }
            else{
                std::cout<<"0"<<endl;
            }
        }
    }
    return 0;
}