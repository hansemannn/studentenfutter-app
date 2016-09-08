exports.formattedStars = function(rating, size) {
    var stars = rating ? rating.value : 0;
    var path = "images/icons/stars/" + size + "/";

    if (stars > 0 && stars < 0.75) {
        return path + "0_5.png";
    } else if(stars >= 0.75 && stars < 1.25) {
        return path + "1_0.png";
    } else if(stars >= 1.25 && stars < 1.75) {
        return path + "1_5.png";
    } else if(stars >= 1.75 && stars < 2.25) {
        return path + "2_0.png";
    } else if(stars >= 2.25 && stars < 2.75) {
        return path + "2_5.png";
    } else if(stars >= 2.75 && stars < 3.25) {
        return path + "3_0.png";
    } else if(stars >= 3.25 && stars < 3.75) {
        return path + "3_5.png";
    } else if(stars >= 3.75 && stars < 4.25) {
        return path + "4_0.png";
    } else if(stars >= 4.25 && stars < 4.75) {
        return path + "4_5.png";
    } else if(stars >= 4.75) {
        return path + "5_0.png";
    }
    
    return path + "0_0.png";
};
