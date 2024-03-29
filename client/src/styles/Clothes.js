import styled from 'styled-components';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

export const ClothesContainer = styled.div`
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;

    .category-title {
        font-family: 'Fashion';
        font-size: 36px;
        font-weight: 600;
        letter-spacing: 2px;
    }

    .items {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
    }
`;

export const ClothingCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: var(--box-shadow);
    padding: 20px;
    border-radius: 25px;
    max-width: 250px;
    margin: 12px;

    p {
        font-size: 28px;
        color: var(--black);
        font-family: 'Fashion';
        font-weight: 600;
        letter-spacing: 2px;
        text-align: center;
    }

    .file-name {
        word-break: break-word;
    }

    img {
        width: 250px;
        height: auto;
        cursor: pointer;
    }

    .item-options {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 5px 0 15px 0;
    }

    .item-option {
        font-size: 38px !important;
        padding: 6px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.1s;
        color: #a7a7a7;
        background: none;

        &:hover {
            background-color: rgba(0, 0, 0, 0.1);
            color: var(--black);
        }
    }

    .item-option.important {
        color: var(--secondary);
    }
`;

export const DropdownContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    & .curr-category {
        font-size: 24px;
        margin-bottom: 12px;

        & .category-name {
            font-size: 24px;
            color: var(--secondary);
            text-decoration: underline;
        }
    }

    & .new-category {
        font-size: 20px;
    }
`;

export const SwapCategoryDropdown = styled(Dropdown)`
    width: 100%;
    
    & .Dropdown-control {
        display: flex;
        align-items: center;
        font-size: 20px;
        color: var(--black);
        border: 1px solid var(--black);
        cursor: pointer;

        &:hover {
            border-color: var(--secondary)
        }

        & .Dropdown-placeholder {
            font-size: 20px;
            color: var(--black);
        }

        & .Dropdown-arrow {
            border-color: var(--black) transparent transparent;
        }
    }

    & .Dropdown-menu {
        max-height: 200px;
        border: 1.5px solid var(--secondary);
        overflow-y: auto;

        & .Dropdown-option {
            font-size: 20px;
            color: var(--black);
            transition: all 0.1s;
        

            &.is-selected,
            &:hover {
                background-color: var(--secondary-light);
            }
        }
    }

    &.is-open {
        & .Dropdown-control {
            border-color: var(--secondary);

            & .Dropdown-arrow {
                border-color: transparent transparent var(--black);
            }
        }
    }
`;