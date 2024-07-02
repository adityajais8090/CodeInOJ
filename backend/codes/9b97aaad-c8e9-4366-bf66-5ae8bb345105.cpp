
  // Your First C++ Program
#include <bits/stdc++.h>
using namespace std;


int main() {
    int n, sum = 0;
    std:: cin >> n;
    vector<int> a(n);
    for(int i=0; i<n;i++){
    std::cin >> a[i];
    sum = sum + a[i];
    }
    
    std :: cout << sum ;
    return 0;
}

  