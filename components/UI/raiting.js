const Rating = ({ title }) => {
    const rootStyles = ['star_ratings'];
    rootStyles.push(`r_${title * 10}`);

    return (
        <>
            <div className={rootStyles.join(' ')} title={title}>
            </div>
        </>
    );
};

export default Rating;