#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    string type;
    int n,bedrooms,bathrooms,price=0;
    cin>>n;
    while(n--){
        cin>>type>>bedrooms>>bathrooms;
        price+=bedrooms*50+bathrooms*100;
        if(type.compare("standard")!=0){
            price+=100;
        }
    }
    cout<<price;
    
    return 0;
}
