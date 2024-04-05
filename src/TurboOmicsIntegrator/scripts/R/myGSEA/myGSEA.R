# if (!require("Biocmanager", quietly = true))
#   install.packages("BiocManager")
# 
# install.packages("jsonlite")
# BiocManager::install("fgsea")
# BiocManager::install("reactome.db")
# 

cat('** Start script: myGSEA.R\n')

# Constants
DATE_DB <- "202311" # date of the database employed

# Get command line arguments
args = commandArgs(trailingOnly = T)

basePath = args[1] # "S:\\U_Proteomica\\UNIDAD\\Softwares\\MacrosRafa\\data\\Metabolomics\\PESA_Integromics\\TestServer\\GSEA\\jobs\\Mus_musculus-UniprotID-Treatment_A12_PBS"  #args[0]
workingPath = args[2] # path to job_id
org = args[3] # "Mus_musculus" #args[1]

# Import libraries
library(fgsea)
library(reactome.db)
library(jsonlite)


# Open json with rank info

cat('**\n')
cat("** Working Path: ", workingPath)
cat('\n**\n')

df <- as.data.frame(fromJSON(paste0(workingPath, '/EID_GN_RankStat.json')))
df <- df[order(df$RankStat, decreasing = T),]

# Create vector with statistic
rankStat <- df$RankStat

# Enrichment with HALLMARK
cat('** Perform enrichment with HALLMARK\n')

names(rankStat) <- toupper(df$GeneName)

pathways <- gmtPathways(
  paste0(basePath, "/../../mydb/", DATE_DB, "/Homo_sapiens/", "h.all.v2023.2.Hs.symbols.gmt")
  )

fgseaRes <- fgsea(pathways, rankStat, maxSize=500, minSize=5)

out <- fgseaRes[fgseaRes$pval < 0.1]
out <- out[order(out$pval)]

outJson <- toJSON(out)
fileConn<-file(paste0(workingPath, "/HALLMARK_GSEA.json"))
writeLines(outJson, fileConn)
close(fileConn)

# Enrichment with Reactome
cat('** Perform enrichment with Reactome\n')

names(rankStat) <- df$EntrezGene

pathways <- reactomePathways(names(rankStat))

fgseaRes <- fgsea(pathways, rankStat, maxSize=500, minSize=5)

out <- fgseaRes[fgseaRes$pval < 0.1]
out <- out[order(out$pval)]

outJson <- toJSON(out)
fileConn<-file(paste0(workingPath, "/REACTOME_GSEA.json"))
writeLines(outJson, fileConn)
close(fileConn)

# Enrichment with KEGG
cat("** Perform enrichment with KEGG\n")

names(rankStat) <- df$GeneName

pathways <- gmtPathways(
  paste0(basePath, "/../../mydb/", DATE_DB, "/", org,  "/", "kegg.gmt")
)

fgseaRes <- fgsea(pathways, rankStat, maxSize=500, minSize=5)

out <- fgseaRes[fgseaRes$pval < 0.1]
out <- out[order(out$pval)]

outJson <- toJSON(out)
fileConn<-file(paste0(workingPath, "/KEGG_GSEA.json"))
writeLines(outJson, fileConn)
close(fileConn)

cat('** End script\n')