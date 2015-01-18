##################

# Add stats functions to the Enumerable class (for use on Arrays)
module Enumerable

        def sum
                self.inject(0){|accum, i| accum + i }
        end

        def mode
                freq = self.inject(Hash.new(0)) { |h,v| h[v] += 1; h }
                self.sort_by { |v| freq[v] }.last
        end

        def median
                (self.sort[(self.length - 1) / 2] + self.sort[self.length / 2]) / 2.0
        end

        def mean
                self.sum/self.length.to_f
        end

        def variance
                m = self.mean
                sum = self.inject(0){|accum, i| accum +(i-m)**2 }
                sum/(self.length - 1).to_f
        end

        def stdev
                if( self.length > 1 )
                        return Math.sqrt(self.variance)
                else
                        return 0;
                end
        end

end


##################
