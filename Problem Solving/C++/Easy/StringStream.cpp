#include <sstream>
#include <cstring>  
#include <vector>
#include <iostream>
using namespace std;

vector<int> parseInts(string str) {
	vector<int> tmp;
    string n;
    for(int i=0;i<str.length();i++){
        if(str[i]==','){
           tmp.push_back(stoi(n));
           n="";
        }
        else{
            n+=str[i];
        }
    }
    tmp.push_back(stoi(n));
    return tmp;
}

int main() {
    string str;
    cin >> str;
    vector<int> integers = parseInts(str);
    for(int i = 0; i < integers.size(); i++) {
        cout << integers[i] << "\n";
    }
    
    return 0;
}