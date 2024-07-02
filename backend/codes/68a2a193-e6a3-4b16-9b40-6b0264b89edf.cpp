
  // Your First C++ Program
#include <bits/stdc++.h>
using namespace std;


int main() {
    int n;
    std:: cin >> n;
    vector<int> a(n);
    for(int i=0; i<n;i++){
    std::cin >> a[i];
    }
    
    for(int i=0; i<n;i++){
    std::cout << a[i];
    }
    return 0;
}

  