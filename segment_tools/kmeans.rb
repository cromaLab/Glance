require 'ai4r/lib/ai4r.rb'
require 'arraystats.rb'

class KMeansWithFiltration < Ai4r::Clusterers::KMeans
  def correct_using_stdev(nstdev)
    @clusters.each{|cluster| cluster.set_data_items(reject_not_trusted_items(cluster.data_items.flatten, nstdev).map{|di| [di]}) }
    recompute_centroids
  end

  def take_majority_decision_on_clusters minimum
    @clusters.each do |cluster|
      raise(Exception, 'Majority decision on cluster failed') if cluster.data_items.count < minimum
    end
  end
end

def kmeans(workerSegs, what, threshold, stdev_filtering = nil)
  ## First, find our guess for K
  ##  This can be improved by jointly optimizing the start and end times and seeing tightest correlation
  entryCounts = Array.new
  linearSet = Array.new
  i = 0
  workerSegs.each{ |entry|
    # segments by worker
    entryCounts << entry[1].length

    entry[1].each{ |segRange|
      linearSet[i] = Array.new
      linearSet[i] << metric_of_span(segRange, what).to_f
      i = i + 1
    }
  }

  # Find the median value to use as K
  entryCounts = entryCounts.sort
  k = (entryCounts[(workerSegs.length - 1) / 2] + entryCounts[workerSegs.length / 2]) / 2.0

  #now run kmeans
  ai4r_data = Ai4r::Data::DataSet.new(:data_items => linearSet)
  km = KMeansWithFiltration.new.build(ai4r_data, k)
  #filter out clusters with data set smaller than 50% of workers
  km.take_majority_decision_on_clusters(threshold)
  #filter outliers if necessary
  km.correct_using_stdev(stdev_filtering) if stdev_filtering

  clusters = km.clusters.map(&:data_items)

  {:centroids => km.centroids,
   :rmse => rmse(clusters, km.centroids)}
end

def metric_of_span span, what
  case what
    when :start
      span.first
    when :end
      span.last
    when :length
      span.last - span.first
    else 0
  end
end

def rmse clusters, centroids
  return nil if clusters.empty?

  sum = 0
  numPoints = 0
  for i in 0...clusters.length
    for j in 0...clusters[i].length
      sum += ((clusters[i][j][0].to_f - centroids[i][0].to_f)**2)
      numPoints += 1
    end
  end

  Math.sqrt(sum/numPoints)
end

def make_spans_by_points starts, ends
  [].tap{|spans| starts.each_with_index {|start, i| spans << [start, ends[i]]}}
end

def reject_not_trusted_items items, nstdev = 1
  items_stdev = items.stdev
  items_mean = items.mean

  items.reject do |item|
    item < (items_mean - nstdev * items_stdev) || item > (items_mean + nstdev * items_stdev)
  end
end