import Answer from './Answers';
const QuestionAnswer = ({ item, index }) => {
    return (
        <>
            <div key={index + Math.random()} className={item.type == 'q' ? 'flex justify-end  ' : ''}>
                {
                    item.type == 'q' ?
                        <li key={index + Math.random()}
                            className='text-right p-2 rounded-xl bg-zinc-700 '>

                        <Answer ans={item.text} totalResult={1} index={index} type={item.type} /></li>
                        : item.text.map((ansItem, ansIndex) => (
                           <li key={ansIndex + Math.random()} className='text-left'><Answer ans={ansItem} totalResult={item.length} type={item.type} index={ansIndex}   /></li>

                        ))
                }
            </div>
        </>
    )
}

export default QuestionAnswer;