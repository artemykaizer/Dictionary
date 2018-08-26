const styles = theme => ({
    button: {
      marginBottom: "10px",
      color: "black",
      borderColor: "black",
      '&:hover': {
          backgroundColor: "rgba(56, 56, 56, 0.027)",
          borderColor: "black"
      }
    },
    input: {
      display: 'none',
    },
    mainWord: {
        fontSize: "7vh",
        textAlign: "center"
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "column",
        width: "15%",
        alignItems: "center",
        margin: "auto"
    },
    noWords: {
        textAlign: "center",
        fontSize: "20px"
    }
  });
  
export default styles