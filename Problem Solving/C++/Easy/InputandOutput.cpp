#include<iostream>
int main(){
    int sum=0,n,c=3;
    do{
        std::cin>>n;
        sum+=n;
        c--;
    }while(c>0);
    std::cout<<sum;
    return 0;
} 