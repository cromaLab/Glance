#module SequenceAlignment
  DELTA = 0.0000001

  # solve_problem_for_text('1-5;7-8', '2-6;9-12')
  def alignSegs input, baseline
    baseline = baseline.split(';').map{|range| range.split('-').map(&:to_f)}
    input = input.split(';').map{|range| range.split('-').map(&:to_f)}
    results = solveAlign baseline, input
    retHash = Hash.new
    reHash["shift"] = results[0]
    reHash["segs"] = results[1]
  end

  # solve_problem([[1,5], [7,8]], [[2,6], [9,12]])
  def solveAlign input, baseline
    #calculate centers
    baseline_centers = baseline.map {|bl| range_center(bl[0],bl[1])}
    input_centers = input.map{|bl| range_center(bl[0],bl[1])}

    #calculate gap penalty for algorithm. Assume that non-matching is similar to comparing minimum and maximum elements
    all_centers = baseline_centers + input_centers
    gap_penalty = all_centers.max - all_centers.min

    #calculate Levenshtein Matrix (in fact, this is combintion of http://en.wikipedia.org/wiki/Levenshtein_distance
    # and http://en.wikipedia.org/wiki/Needleman-Wunsch_algorithm)
    lev_distance = levenshtein_distance(baseline_centers, input_centers, gap_penalty) {|a,b| distance(a,b)}

    #now trace back the solution
    matching_baseline, matching_input = run_back(lev_distance, gap_penalty, baseline_centers, input_centers)
#puts("MATCHED IN: #{matching_input[0].length}")

    #calculate avg error
    correction = []
    (1..matching_input.size).each {|i| correction << ((!matching_baseline[i-1].nil? && !matching_input[i-1].nil?) ? (matching_baseline[i-1] - matching_input[i-1]) : nil)}

    #remove odd nils
    correction.compact!
    matching_input.compact!
    avg_error = correction.reduce(0) {|sum, cor| sum + cor.abs}.fdiv(correction.size)

    #corrected input
    corrected_input = []
    input.each_with_index do |inp, i|
      #(corrected_input << inp.map{|r| correction[i].nil? ? r : r + correction[i]})  if matching_input[i].present?
      # WSL: TODO -- we only want to make this correction if the shift does not roll off the end of the span
      (corrected_input << inp.map{|r| correction[i].nil? ? r : r + correction[i]})  unless matching_input[i].nil?
    end

#puts("(INSIDE): CORR: #{corrected_input}, ERR: #{avg_error}")
=begin
    {
        :segs => corrected_input,
        :shift => avg_error
    }
=end
    retHash = Hash.new
    retHash["segs"] = corrected_input
    retHash["shift"] = avg_error

    return retHash
  end

  private

  def range_center a,b
    a + (b-a).fdiv(2)
  end

  def distance a,b
    (a-b).abs
  end

  def run_back lev, gap_penalty, arr1, arr2
    new_arr1, new_arr2 = [],[]

    i = lev.size - 1
    j = lev[0].size - 1
    while i > 0 || j > 0
      #find the least expensive path
      next_i, next_j = if i > 0 && j>0 && (lev[i][j] - lev[i-1][j-1] - distance(arr1[i-1],arr2[j-1])).abs < DELTA
                         [i-1, j-1]
                       elsif i > 0 && (lev[i][j] - lev[i-1][j] - gap_penalty).abs < DELTA
                         [i-1, j]
                       elsif j > 0 && (lev[i][j] - lev[i][j-1] - gap_penalty).abs < DELTA
                         [i, j-1]
                       end

      if next_i == i
        new_arr1 << nil
        new_arr2 << arr2[j-1]
      elsif next_j == j
        new_arr1 << arr1[i-1]
        new_arr2 << nil
      else
        new_arr1 << arr1[i-1]
        new_arr2 << arr2[j-1]
      end

      i, j = next_i, next_j
    end

    [new_arr1.reverse, new_arr2.reverse]
  end

  def levenshtein_distance(arr1, arr2, gap_penalty = 1, &difference_proc)
    m = arr1.size
    n = arr2.size
    lev = Array.new(m+1) {Array.new(n+1) {0}}
    (1..m).each {|i| lev[i][0] = gap_penalty*i}
    (1..n).each {|j| lev[0][j] = gap_penalty*j}
    (1..n).each do |j|
      (1..m).each do |i|
        lev[i][j] = [
            lev[i-1][j] + gap_penalty,  # a deletion
            lev[i][j-1] + gap_penalty,  # an insertion
            lev[i-1][j-1] + difference_proc.call(arr1[i-1], arr2[j-1]) # increased complexity
        ].min
      end
    end
    lev
  end
#end


