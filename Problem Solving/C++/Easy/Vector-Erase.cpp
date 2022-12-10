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
    vector<int>v,removing;
    int size=GetNumber();
    for(int i=0;i<size;i++){
        v.push_back(GetNumber());
    }
    int removeSingle=GetNumber();
    v.erase(v.begin()+removeSingle-1);
    int removeRangeStart=GetNumber(),removeRangeEnd=GetNumber();
    v.erase(v.begin()+removeRangeStart-1,v.begin()+removeRangeEnd-1);
    std::cout<<v.size()<<std::endl;
    for(int i=0;i<v.size();i++){
        std::cout<<v[i];
        if(i+1!=v.size()){
            std::cout<<" ";
        }
    }

    return 0;
}