
  // Your First C++ Program
#include <bits/stdc++.h>
using namespace std;


int main() {
    int n, sum;
    std:: cin >> n;
    vector<int> a(n);
    for(int i=0; i<n;i++){
    std::cin >> a[i];
    sum += a[i];
    }
    
    for(int i=0; i<n;i++){
    std::cout << a[i] << " ";
    }
    std :: cout << endl << sum ;
    return 0;
}

  