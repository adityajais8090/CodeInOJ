import '../styles/problem.css';
import { useLocation } from 'react-router-dom';


const Problem = () =>{
    const location = useLocation();
    const { problem } = location.state;

    return (
        <>
        <div className="Problem" style={{ backgroundColor: '#eee' }}>
      <div className="container py-5">
        
        <div className="row">
          <div className="col-lg-6">
            <div className="card mb-2">
              <div className="card-body">
              <h5 className="card-title">{`${problem.code}. ${problem.title}`}</h5>
                  <p className="card-text">
                    {problem.description}
                  </p>
                  <h6 className="card-subtitle mb-2 text-muted">Test Cases</h6>
                  <p className="card-text">
                    <strong>Input:</strong> Example input<br />
                    <strong>Output:</strong> Expected output
                  </p>
                  <h6 className="card-subtitle mb-2 text-muted">Tags</h6>
                  <p className="card-text">
                  {problem.tags.join(', ')}
                  </p>
              </div>
            </div>
          </div>
         <div className='col'>
          <div className="col-lg-12">
            <div className="card mb-2">
              <div className="card-body text-end">
              <form>
                <div class="form-group">
                    <label for="exampleFormControlTextarea1">Compiler</label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="8"></textarea>
                </div>
                </form>
              </div>
            </div>
            </div>
           
           
              <div className="col-lg-12 ">
                <div className="card mb-2">
                  <div className="card-body text-end">
                  <form>
                <div class="form-group">
                    <label for="exampleFormControlTextarea1">Input</label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="1"></textarea>
                </div>
                </form>
                <form>
                <div class="form-group">
                    <label for="exampleFormControlTextarea1">Output</label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="1"></textarea>
                </div>
                </form>
                  </div>
                  </div>

            </div> {/* end row */}
          </div> {/* end col-lg-8 */}
        </div> {/* end row */}
      </div> {/* end container */}
    </div>

        </>
    );
};

export default Problem;