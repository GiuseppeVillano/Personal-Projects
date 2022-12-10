#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <map>
#include <set>
#include <algorithm>
#include <string>
using namespace std;

struct Tag{
    int id,level=0;
    string tag_name;
    tuple<int,string> parent_node;
    vector<tuple<string,string>> attributes;
    void print(){
        cout<<"NODE-> id: "<<id<<" tag_name: "<<tag_name<<" level: "<<level<<endl;
        cout<<"ParentNode-> id:"<<get<0>(parent_node)<<" tag name:"<<get<1>(parent_node)<<endl;
        cout<<"Attributes: ";
        for(int i=0; i<attributes.size(); i++){
            cout<<get<0>(attributes[i])<<" "<<get<1>(attributes[i])<<endl;
        }
        cout<<endl;
    }
};

int GetNumber(){
    int t;
    cin>>t;
    return t;
}

string GetString(){
    string t;
    cin>>t;
    return t;
}

string GetTagName(string tag_line){
    string tag_name;
    for(int i=1;i<tag_line.length();i++){
        if(tag_line[i]==' '){break;}
        tag_name+=tag_line[i];   
    }
    return tag_name;
}

vector<tuple<string,string>> GetAttributes(string tag_line){
    vector<tuple<string,string>> cur_attributes;
    int pos = tag_line.find(' '),switch_attr_value=0,commas=0;
    if(pos==-1){return cur_attributes;}
    string attr,value;
    //remove part with tag name
    tag_line = tag_line.substr(pos,tag_line.size()-1);
    for(int i = 0; i < tag_line.size();i++){
        //Check attribute name
        if(switch_attr_value==0){
            if(tag_line[i]==' '){
                continue;
            }
            if(tag_line[i]=='='){ 
                switch_attr_value++;
            }
            else{
                attr+=tag_line[i];
            }
        }
        else{
            if(commas==0){
                if(tag_line[i]==' '){
                    continue;
                }
                commas++;
            }
            else{
                if(tag_line[i]=='"'){
                    cur_attributes.push_back(make_tuple(attr,value));
                    commas=0;
                    attr=value="";
                    switch_attr_value--;
                    continue;
                }
                value+=tag_line[i];
            }
        }
    }

    return cur_attributes;
}

void GetChildsAndValue(vector<string> &tags_name_check,string &tag_check,string &tmp){
    int pos = tag_check.find('.');

    if(pos==-1){
        pos = tag_check.find('~');
        tmp= tag_check.substr(0,pos);
        tags_name_check.push_back(tmp);
        tag_check = tag_check.substr(pos+1,tag_check.size()-1);
    }
    else{
        while(pos!=-1){
            tmp= tag_check.substr(0,pos);
            tags_name_check.push_back(tmp);
            tag_check = tag_check.substr(pos+1,tag_check.size()-1);
            pos = tag_check.find('.');
            if(pos==-1){
                pos = tag_check.find('~');
                tmp= tag_check.substr(0,pos);
                tags_name_check.push_back(tmp);
                tag_check = tag_check.substr(pos+1,tag_check.size()-1);
                break;
            }
        }
    }
}

bool CheckHierarchy(vector<string> tags_name,Tag t,vector<Tag> tags){
    string parent_node_name = get<1>(t.parent_node);
    if(t.level!=tags_name.size()-1){
        return false;
    }
    for(int i=0;i<tags.size();i++){
        if(tags_name.size()<=1){
            return true;
        }
        if(tags[i].tag_name.compare(parent_node_name)==0){
            tags_name.pop_back();    
            t=tags[i];      
            return CheckHierarchy(tags_name,t,tags);
        }
    }
    return false;
}

int main() {
    int n=GetNumber(),q=GetNumber();
    int level=0,id_autoincr=0;
    vector<Tag> tags,tag_parent;
    string tag_line;
    //Get HRML
    while (n--&&getline(cin, tag_line)) {
        Tag tag;
        //Buffer fix
        if(tag_line.length()==0||tag_line.compare("-1")==0){n++;continue;}
        //Open Tag
        if(tag_line[1]!='/'){
            tag.id=id_autoincr;
            tag.level=level;
            tag.tag_name=GetTagName(tag_line);
            tag.attributes=GetAttributes(tag_line);
            tag_parent.push_back(tag);
            level++;
            id_autoincr++;
        }
        //Close Tag
        else{
            if(level<=1){--level;tags.push_back(tag_parent.back());continue;}
            Tag cur_tag=tag_parent.back();
            tag_parent.pop_back();
            cur_tag.parent_node = make_tuple(tag_parent.back().id,tag_parent.back().tag_name);
            tags.push_back(cur_tag);
            --level;
        }
    }
    
    //Check Attributes existence
    for(int i=0;i<q;i++){
        vector<string> tags_name_check;
        string tag_check = GetString(),tmp;
        //Loop on childs
        GetChildsAndValue(tags_name_check,tag_check,tmp);
        string value= tag_check;
        bool enter2=false;
        //Loop on tags
        for(int k=0;k<tags.size();k++){
            //find the last tag name to check the attribute
            if(tags[k].tag_name.compare(tags_name_check.back())==0){
                enter2=true;
                //Loop on attributes of the current tag found
                bool enter=false;
                for(int j=0;j<tags[k].attributes.size();j++){
                    //if exists
                    if(get<0>(tags[k].attributes[j]).compare(value)==0){
                        enter=true;
                        //check if the hiearchy is correct
                        if(CheckHierarchy(tags_name_check,tags[k],tags)){
                            cout<<get<1>(tags[k].attributes[j])<<endl;
                        }
                        else{
                            cout<<"Not Found!"<<endl;
                        }
                        break;
                    }
                }
                if(!enter){
                    cout<<"Not Found!"<<endl;
                }
                break;
            }
        }
        if(!enter2){
            cout<<"Not Found!"<<endl;
        }
    }
    
    return 0;
}