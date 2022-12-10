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
    vector<int> n;
    int t=GetNumber();
    for(int i=0;i<t;i++){
        n.push_back(GetNumber());
    }
    std::sort(n.begin(),n.end());
    for(int i=0;i<t;i++){
        std::cout<<n[i]<<" ";
    }
    
    return 0;
}
