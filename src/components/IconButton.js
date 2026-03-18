import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native"
import { images } from "../images";
import styled from "styled-components/native";

// completed 값에 따라 다른 스타일이 적용되도록 수정
const Icon = styled.Image`
    tint-color: ${({ theme, completed }) => completed ? theme.done : theme.text }; 
    width: 30px;
    height: 30px;
    margin: 10px;
`
const IconButton = ({ type, onPressOut, id, completed }) => { // 전달된 함수를 이용하도록 수정한다.
    const _onPressOut = () => {
        onPressOut(id);
    }
    return (
        <TouchableOpacity onPressOut={_onPressOut}>
            <Icon source={type} completed={completed}/>
        </TouchableOpacity>
    )
};

IconButton.defaultProps = {
    onPressOut: () => {},
};

IconButton.propTypes = {
    type: PropTypes.oneOf(Object.values(images)).isRequired,
    onPressOut: PropTypes.func,
    id: PropTypes.string, // 타입 정의 props로 onPressOut이 전달되지 않았을 경우에도 문제가 발생되지 않도록, defaultProps를 이용하여 지정
}


export default IconButton;