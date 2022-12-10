#include <iostream>

using namespace std;

class Rectangle{
    protected:
    float width,height;

    public:
        Rectangle():width(0),height(0){}
        
        virtual void display(){
            cout<<width<<" "<<height<<endl;
        }
};

class RectangleArea : public Rectangle{
    public:
        RectangleArea():Rectangle(){
        }
        void read_input(){
            cin>>width>>height;
        }
        
        virtual void display(){
            cout<<width*height<<endl;
        }
};


int main()
{
    /*
     * Declare a RectangleArea object
     */
    RectangleArea r_area;
    
    /*
     * Read the width and height
     */
    r_area.read_input();
    
    /*
     * Print the width and height
     */
    r_area.Rectangle::display();
    
    /*
     * Print the area
     */
    r_area.display();
    
    return 0;
}