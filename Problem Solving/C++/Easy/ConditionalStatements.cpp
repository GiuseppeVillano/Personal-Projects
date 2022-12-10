#include<iostream>
int main(){
    std::string numbers[]={"one", "two", "three", "four", "five", "six", "seven", "eight","nine"};
    int n;
    std::cin >> n;
    if(n<=9){
        std::cout<<numbers[n-1];
    }
    else{
        std::cout<<"Greater than 9";
    }
    return 0;
} 