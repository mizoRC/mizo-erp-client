import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core";
// @material-ui/icons
import { primary, secondary } from '../../styles/colors';


const useStyles = makeStyles({
    cardHeaderPrimary: {
        borderRadius: "3px",
        padding: "1rem 15px",
        marginLeft: "15px",
        marginRight: "15px",
        marginTop: "-30px",
        border: "0",
        marginBottom: "0",
        backgroundColor: primary
    },
    cardHeaderSecondary: {
        borderRadius: "3px",
        padding: "1rem 15px",
        marginLeft: "15px",
        marginRight: "15px",
        marginTop: "-30px",
        border: "0",
        marginBottom: "0",
        backgroundColor: secondary
    },
    cardHeaderPlain: {
        marginLeft: "0px",
        marginRight: "0px"
    }
});

export default  function CardHeader(props) {
  const classes = useStyles();
  const { className, children, color, textColor, plain, ...rest } = props;
  return (
    <div 
        className={(color === "primary") ? classes.cardHeaderPrimary : classes.cardHeaderSecondary}
        {...rest}
        style={{
            color: (!!textColor) ? textColor : 'black'
        }}
    >
      {children}
    </div>
  );
}

CardHeader.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(["primary", "secondary"]),
  textColor: PropTypes.oneOf(["black", "white"]),
  plain: PropTypes.bool,
  children: PropTypes.node
};