import styled from "styled-components";

export const ContainerBannerAdmin = styled.div`
    width: 100%;
    height: 300px;
    background-color: #4529e6;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-bottom: 150px;

    .containerContentAdmin{
        width: 80%;
        height: 297px;
        position: absolute;
        background-color: #fdfdfd;
        top: 100px;
        z-index: 1;
        left: 95px;

        .content {
            margin: 50px auto;
            display: flex;
            flex-direction: column;
            align-items: baseline;
            
            abbr{
                width: 50px;
                height: 50px;
                text-decoration: none;
                border-radius: 50px;
                background-color: var(--brand-2);
                color: #ffffff;
                font-size: 27px;
                font-weight: 700;
                display: flex;
                justify-content: center;
                align-items: center;

            }
            p{  display: flex;
                font-size: 20px;
                font-family: 'Lexend' ;
                font-weight: 600 ;
            }
            span{
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                padding: 4px 8px;
                gap: 10px;
                color: #4529E6;
                background: #EDEAFD;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 500;

            }

        }
        p{
            margin: 0 50px;
        }
        button{
            margin: 20px 50px;
            padding: 10px;
            border: solid 1px #4529E6;
            background-color: transparent;
            color: #4529E6;
            border-radius: 4px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
        }
    }
`