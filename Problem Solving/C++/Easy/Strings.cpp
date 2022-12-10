#include <iostream>
#include <string>
using namespace std;

void PrintSize(string a){
    std::cout<<a.length()<<" ";
}

int main() {
    string a,b,a1,b1;
    std::cin>>a>>b;
    PrintSize(a);
    PrintSize(b);
    std::cout<<endl<<a+b<<endl;
    a1=b[0];
    b1=a[0];    
    
    b=b.substr(1, b.size() - 1);
    a=a.substr(1, a.size() - 1);
    
    a1+=a;
    b1+=b;
    std::cout<<a1<<" "<<b1;
    
    return 0;
}