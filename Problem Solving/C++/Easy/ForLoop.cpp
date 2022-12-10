#include<iostream>
int main(){
    std::string numbers[]={"one", "two", "three", "four", "five", "six", "seven", "eight","nine"};
    int a,b;
    std::cin >> a>>b;
    for(int n=a; n<=b; n++){
        if(n<=9){
            std::cout<<numbers[n-1]<<std::endl;
        }
        else{
            std::string s=n%2==0?"even":"odd";
            std::cout<<s<<std::endl;
        }
    }
    return 0;
} 