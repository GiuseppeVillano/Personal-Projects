#include <iostream>
#include <iomanip> 
using namespace std;

int main() {
	int T; cin >> T;
	cout << setiosflags(ios::uppercase);
	cout << setw(0xf) << internal;
	while(T--) {
		double A; cin >> A;
		double B; cin >> B;
		double C; cin >> C;
    cout<<left<<nouppercase<<hex<<showbase<<(long long)A<<endl;
    cout<<noshowbase<<showpos<<setfill('_')<<setw(15)<<right<<fixed<<setprecision(2)<<B<<endl;
    cout<<noshowpos<<uppercase<<scientific<<setprecision(9)<<C<<endl;
	}
	return 0;
}