import React, {FC} from 'react';
import TaskLoading from "../components/loading";

const Loading: FC = props => {
    return <div className={'h-full flex justify-center items-center'}>
        <TaskLoading/>
    </div>;
};


export default Loading;