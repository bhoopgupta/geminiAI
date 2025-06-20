import { useEffect, useRef, useState } from 'react';
import './App.css';
import { URL } from './constants';
import RecentSearch from './components/RecentSearch';
import QuestionAnswer from './components/QuestionAnswer';

function App() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem('history')) || []
  );
  const [selectedHistory, setSelectedHistory] = useState('');
  const [loader, setLoader] = useState(false);
  const scrollToAns = useRef();

  const askQuestion = async () => {
    if (!question && !selectedHistory) return;

    if (question) {
      let history = JSON.parse(localStorage.getItem('history')) || [];
      history = [question, ...history.slice(0, 19)];
      history = history.map(item =>
        item.charAt(0).toUpperCase() + item.slice(1).trim()
      );
      history = [...new Set(history)];
      localStorage.setItem('history', JSON.stringify(history));
      setRecentHistory(history);
    }

    const payloadData = question || selectedHistory;
    const payload = {
      contents: [{ parts: [{ text: payloadData }] }]
    };

    setLoader(true);
    let response = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    response = await response.json();
    let dataString = response.candidates[0].content.parts[0].text;
    dataString = dataString.split("* ").map(item => item.trim());

    setResult(prev => [
      ...prev,
      { type: 'q', text: payloadData },
      { type: 'a', text: dataString }
    ]);
    setQuestion('');

    setTimeout(() => {
      scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
    }, 500);

    setLoader(false);
  };

  const isEnter = (event) => {
    if (event.key === 'Enter') {
      askQuestion();
    }
  };

  useEffect(() => {
    if (selectedHistory) askQuestion();
  }, [selectedHistory]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-1/5 border-r border-gray-300 p-4 max-h-60 md:max-h-full overflow-auto">
        <RecentSearch
          recentHistory={recentHistory}
          setRecentHistory={setRecentHistory}
          setSelectedHistory={setSelectedHistory}
        />
      </div>

      {/* Main Content */}
      <div className="w-full md:w-4/5 p-4 flex flex-col justify-between">
        {/* Heading */}
        <h1 className="text-2xl md:text-4xl text-center font-bold text-gradient mb-4">
          Hello User, Ask me Anything
        </h1>

          {/* Loader */}
 
          {loader && (
            <div role="status" className="text-center mb-2">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591
                    50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 
                    22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082
                    100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 
                    73.1865 27.4043 91.5094 50 91.5094C72.5957 91.5094
                    90.9186 73.1865 90.9186 50.5908C90.9186 27.9951 
                    72.5957 9.67221 50 9.67221C27.4043 9.67221 
                    9.08144 27.9951 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 
                    35.9116 97.0079 33.5532C95.2932 28.8227 
                    92.871 24.3692 89.8167 20.348C85.8452 
                    15.1192 80.8826 10.7235 75.2124 7.41289C69.5422 
                    4.10237 63.2754 1.94025 56.7663 1.05124C51.7667 
                    0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 
                    1.69328 37.813 4.19778 38.4501 6.62326C39.0873 
                    9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 
                    9.54855 51.7191 9.52689 55.5402 10.0491C60.864 
                    10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 
                    17.9648 79.3347 21.5619 82.5849 25.841C84.9175 
                    28.9121 86.7997 32.2913 88.1811 35.8758C89.083 
                    38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}


        {/* Answer Section */}
        <div
          ref={scrollToAns}
          className="flex-1 max-h-[50vh] md:max-h-[65vh] overflow-auto  p-4 rounded-lg custom-scroll mb-4 "
        >
          <ul className=" text-white ">
            {result.map((item, index) => (
              <QuestionAnswer key={index} item={item} index={index} />
            ))}
          </ul>
        </div>

        {/* Input Section */}
        <div className="w-full flex justify-center pb-[100px]">
          <div className="relative w-[60%]">
            <input
              type="text"
              value={question}
              onKeyDown={isEnter}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full p-3 mt-20 pr-20 rounded-md border border-white outline-none text-white bg-transparent"
            />
        
            <button
              onClick={askQuestion}
              disabled={!question.trim() || loader}
              className={`absolute mt-10 top-1/2 right-2 transform -translate-y-1/2 px-4 py-2 rounded-md transition text-sm sm:text-base
                ${!question.trim() || loader
                  ? 'bg-purple-400 cursor-not-allowed text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'}
              `}
            >Ask</button>

          </div>
        </div>


      </div>
    </div>
  );
}

export default App;
