import { API } from '../src/applications/evanotebook/cpp/api'

describe('CPP Code Compiler', () => {
  it('execute hello world', async () => {
      const code = `
 #include <iostream>

int main() {
    std::cout << "¿Cómo estás?";
    return 0;
}
      `;
      const promise = new Promise((resolve) => {
          const api = new API({
              hostWrite: (stdout: string) => {
                  resolve(stdout);
              },
              hostRead: () => {
                  return 0;
              }
          });
          api.compileLinkRun(code);
      });
      const result = await promise;
      expect(result).to.equals("¿Cómo estás?");
  });

    it('redirects stdin numbers to stdout', async () => {
        const code = `
 #include <iostream>

int main() {
    int x = 0;
    std::cin >> x;
    std::cout << x+1;
    return 0;
}
      `;
        const promise = new Promise((resolve) => {
            const api = new API({
                hostWrite: (stdout: string) => {
                    console.log(stdout);
                    resolve(stdout);
                },
                hostRead: () => {
                    return "1";
                }
            });
            api.compileLinkRun(code);
        });
        const result = await promise;
        expect(result).to.equals("2");
    });

    it('redirects stdin string to stdout', async () => {
        const code = `
#include <iostream>
#include <string>

using namespace std;

int main() {
    string name;
    getline(cin, name);
    std::cout << name;
    return 0;
}
      `;
        const promise = new Promise((resolve) => {
            const api = new API({
                hostWrite: (stdout: string) => {
                    console.log(stdout);
                    resolve(stdout);
                },
                hostRead: () => {
                    return "Máximo Décimo Meridio  ";
                }
            });
            api.compileLinkRun(code);
        });
        const result = await promise;
        expect(result).to.equals("Máximo Décimo Meridio");
    });

    it.only('redirects two times', async () => {
        const code = `
#include <iostream>
#include <string>
#include <vector>

using namespace std;

int main() {
    vector<string> names{"", "", ""};
    for(int i=0; i<5; i++) {
       std::cin >> names[0];    
    }
    std::cout << names[0];
    return 0;
}
      `;
        const promise = new Promise((resolve) => {
            let i = 0;
            const api = new API({
                hostWrite: (stdout: string) => {
                    resolve(stdout);
                },
                hostRead: () => {
                    const result =  prompt()+' ';
                    console.log(i++, result);
                    return result;
                }
            });
            api.compileLinkRun(code);
        });
        const result = await promise;
        expect(result).to.equals("Máximo Décimo Meridio");
    });


})