#include <iostream>
#include <math.h>
#include <iomanip>

int main() {
    int i;
    long l;
    char c;
    float f;
    double d;
    std::cin>>i>>l>>c>>f>>d;
    std::cout<<i<<std::endl<<l<<std::endl<<c<<std::endl;
    std::cout << std::fixed << std::setprecision(3) << f<<std::endl;
    std::cout << std::fixed << std::setprecision(9) << d;
    return 0;
}