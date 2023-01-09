#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Spell { 
    private:
        string scrollName;
    public:
        Spell(): scrollName("") { }
        Spell(string name): scrollName(name) { }
        virtual ~Spell() { }
        string revealScrollName() {
            return scrollName;
        }
};

class Fireball : public Spell { 
    private: int power;
    public:
        Fireball(int power): power(power) { }
        void revealFirepower(){
            cout << "Fireball: " << power << endl;
        }
};

class Frostbite : public Spell {
    private: int power;
    public:
        Frostbite(int power): power(power) { }
        void revealFrostpower(){
            cout << "Frostbite: " << power << endl;
        }
};

class Thunderstorm : public Spell { 
    private: int power;
    public:
        Thunderstorm(int power): power(power) { }
        void revealThunderpower(){
            cout << "Thunderstorm: " << power << endl;
        }
};

class Waterbolt : public Spell { 
    private: int power;
    public:
        Waterbolt(int power): power(power) { }
        void revealWaterpower(){
            cout << "Waterbolt: " << power << endl;
        }
};

class SpellJournal {
    public:
        static string journal;
        static string read() {
            return journal;
        }
}; 
string SpellJournal::journal = "";

void counterspell(Spell *spell) {
    if(Fireball* f=dynamic_cast<Fireball*>(spell)){
        f->revealFirepower();
    }
    else if(Frostbite* f=dynamic_cast<Frostbite*>(spell)){
        f->revealFrostpower();
    }
    else if(Waterbolt* w=dynamic_cast<Waterbolt*>(spell)){
        w->revealWaterpower();
    }
    else if(Thunderstorm* t=dynamic_cast<Thunderstorm*>(spell)){
        t->revealThunderpower();
    }
    else{
        string t1 = spell->revealScrollName(), t2 = SpellJournal::read();
        int sum=0;
        for(int i=0;i<t1.length();i++){
            vector<int> indexes;
            int curMax=0;
            //prima trovati gli index da dove cominciare
            for(int j=0;j<t2.length();j++){
                if(t1[i]==t2[j]){
                    indexes.push_back(j);
                }
            }
            //cicla per quei index
            for(int j=0;j<indexes.size();j++){
                int c=0;
                //starta dal corrente fino alla fine
                for(int k=indexes[j];k<t2.length();k++){
                    if(t1[i+c]==t2[k]){
                        c++;
                    }
                    else if(curMax<c){
                        curMax=c;;
                        break;
                    }
                }
            }
            sum+=curMax;
        }
        cout<<sum<<endl;
    }
}

class Wizard {
    public:
        Spell *cast() {
            Spell *spell;
            string s; cin >> s;
            int power; cin >> power;
            if(s == "fire") {
                spell = new Fireball(power);
            }
            else if(s == "frost") {
                spell = new Frostbite(power);
            }
            else if(s == "water") {
                spell = new Waterbolt(power);
            }
            else if(s == "thunder") {
                spell = new Thunderstorm(power);
            } 
            else {
                spell = new Spell(s);
                cin >> SpellJournal::journal;
            }
            return spell;
        }
};

int main() {
    int T;
    cin >> T;
    Wizard Arawn;
    while(T--) {
        Spell *spell = Arawn.cast();
        counterspell(spell);
    }
    return 0;
}