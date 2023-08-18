import { makeStyles } from "@material-ui/core/styles";
// import { colors } from "../../constant/constant";

const productStyle = makeStyles((theme) => ({
  productWrapper: {
    "&. .MuiPaper-elevation1": {
      boxShadow: "none",
    },
    "& .MuiTable-root": {
      "@media (max-width: 991px)": {
        width: "900px",
        overflow: "auto",
        boxShadow: "none",
      },
      "& .MuiTableBody-root": {
        "& .MuiTableRow-root": {
          "& .MuiTableCell-root": {
            "&:last-child": {
              paddingRight: "0",
              textAlign: "right",
            },
          },
        },
      },
    },

    "& .MuiTablePagination-root": {
      marginTop: "20px",
      "& .MuiTablePagination-toolbar": {
        paddingRight: "20px",
        "@media (max-width: 991px)": {
          padding: "0",
        },
        "@media (max-width: 374px)": {
          flexWrap: "wrap",
          justifyContent: "center",
        },
        "& .MuiSelect-selectMenu": {
          height: "40px",
          paddingRight: "25px !important",
          display: "flex",
          alignItems: "center",
        },
        "& .MuiSelect-nativeInput": {
          top: "0",
        },
        "& .MuiIconButton-root": {
          "@media (max-width: 574px)": {
            padding: "8px",
          },
          "@media (max-width: 374px)": {
            marginLeft: "0px",
            marginTop: "10px",
          },
        },
        "& .MuiTablePagination-actions": {
          "@media (max-width: 574px)": {
            marginLeft: "8px",
          },
        },
      },
    },
  },
}));
export { productStyle };
