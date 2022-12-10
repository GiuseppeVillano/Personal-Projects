#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    int *array,n,t;
    std::cin>>n;
    array=new int[n];
    for(int i=0;i<n;i++){
        std::cin>>t;
        array[i]=t;
    }
    for(int i=n-1;i>=0;i--){
        std::cout<<array[i]<<" ";
    }
    delete array;
    return 0;
}
