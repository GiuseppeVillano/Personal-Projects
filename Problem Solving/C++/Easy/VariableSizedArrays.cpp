#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

int GetNumber(){
    int number;
    std::cin>>number;
    return number;
}

int main() {
    int n,q,**matrix,*sizes;
    std::cin>>n>>q;
    matrix=new int*[n];
    sizes=new int[n];
    for(int i=0;i<n;i++){
        int size=GetNumber();
        sizes[i]=size;
        matrix[i]=new int[size];
        for(int j=0;j<size;j++){
            int number=GetNumber();
            matrix[i][j]=number;
        }
    }
    
    for(int i=0;i<n;i++){
        int pos1,pos2;
        std::cin>>pos1>>pos2;
        std::cout<<matrix[pos1][pos2]<<endl;
    }
    
    return 0;
}