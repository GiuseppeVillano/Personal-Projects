#include<bits/stdc++.h>

using namespace std;
#include <vector>

struct Workshops{
    int start_time,duration,end_time;

    bool operator<(const Workshops& rhs){
        return this->end_time < rhs.end_time;
    }
};

struct Available_Workshops{
    int n;
    vector<Workshops> w;
};

Available_Workshops* initialize(int* start_time,int* duration,int n){
    Available_Workshops* aw = new Available_Workshops();
    aw->n=n;
    for(int i=0;i<n;i++){
        Workshops w;
        w.start_time = start_time[i];
        w.duration = duration[i];
        w.end_time = start_time[i]+duration[i];
        aw->w.push_back(w);
    }
    return aw;
}

int CalculateMaxWorkshops(Available_Workshops* ptr){
    int max=1,j=0;

    sort(ptr->w.begin(),ptr->w.end());

    for(int i=j+1;i<ptr->n;i++){
        if(ptr->w[i].start_time>=ptr->w[j].end_time){
            j=i;
            max++;
        }
    }
    return max;
}

int main(int argc, char *argv[]) {
    int n; // number of workshops
    cin >> n;
    // create arrays of unknown size n
    int* start_time = new int[n];
    int* duration = new int[n];

    for(int i=0; i < n; i++){
        cin >> start_time[i];
    }
    for(int i = 0; i < n; i++){
        cin >> duration[i];
    }

    Available_Workshops * ptr;
    ptr = initialize(start_time,duration, n);
    cout << CalculateMaxWorkshops(ptr) << endl;
    return 0;
}