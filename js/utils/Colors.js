define(
    function() {
        const colors = {
            colorNames: ['green', 'yellow', 'orange', 'red'],
            defaultColors: {
                green: {
                    maxPercentage: 100,
                    color: '#31B404'
                }, 
                yellow: {
                    maxPercentage: 90,
                    color: '#D7DF01'
                },
                orange: {
                    maxPercentage: 60,
                    color: '#FE9A2E'
                },
                red: {
                    maxPercentage: 40,
                    color: '#DF0101'
                },
                white: {
                    color: '#FFFFFF'
                }
            },
            getProgressColor: (progress, grades) => {
                let colorGrades = {};
                Object.assign(colorGrades, colors.defaultColors);
                
                if (grades) {
                    grades.forEach(
                        g => {
                            colorGrades[g['color']]['maxPercentage'] = g['maxPercentage'];
                        }
                    );
                }
                
                for (let i = 1; i < colors.colorNames.length; i ++) {
                    if (progress >= colorGrades[colors.colorNames[i]].maxPercentage) {
                        return colorGrades[colors.colorNames[i - 1]].color;
                    }
                }
                
                return colorGrades['red'].color;
            }
        };
        
        return colors;
    }
);