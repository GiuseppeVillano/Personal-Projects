#include <iostream>
#include <deque> 
using namespace std;

void printKMax(int arr[], int n, int k){
    deque<int> dq;
    int last_max=0,pos=0;
    for(int i=0;i<n;i++){
        dq.push_back(arr[i]);
        if(i>=k-1){
            if(pos<i){
                last_max = dq.front();
                for(int j=0;j<dq.size();j++){
                    if(last_max < dq.at(j)){
                        last_max = dq.at(j);
                        pos=i+j;
                    }
                }                
            }
            else if(last_max < dq.back()){
                last_max = dq.back();
                pos=i;
            }
            cout<<last_max<<" ";
            dq.pop_front();
        }
        else{
            if(arr[i]>last_max){
                last_max = arr[i];
                pos=i;
            }
        }
    }
    cout<<endl;
}

int main(){
	int t;
	cin >> t;
	while(t>0) {
		int n,k;
    	cin >> n >> k;
    	int i;
    	int arr[n];
    	for(i=0;i<n;i++)
      		cin >> arr[i];
    	printKMax(arr, n, k);
    	t--;
  	}
  	return 0;
}